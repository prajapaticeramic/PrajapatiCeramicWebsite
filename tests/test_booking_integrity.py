"""Exercise the actual migration against SQLite, including competing confirmations."""
import sqlite3, tempfile, pathlib, concurrent.futures, unittest
MIGRATION=pathlib.Path(__file__).resolve().parents[1]/'drizzle/0000_spotty_bishop.sql'
class BookingIntegrity(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.path=str(pathlib.Path(self.tmp.name)/'test.sqlite');self.db=sqlite3.connect(self.path);self.db.executescript(MIGRATION.read_text());self.slot('a','11:00','12:00',2)
 def tearDown(self):self.db.close();self.tmp.cleanup()
 def slot(self,id,start,end,capacity=2):
  self.db.execute('INSERT INTO slots VALUES (?,?,?,?,?,?,?,?)',(id,'one-hour','Boudha','2099-01-01',start,end,capacity,1));self.db.commit()
 def request(self,id,n=2):
  self.db.execute('INSERT INTO requests (id,token_hash,kind,name,email,phone,experience,studio,date,time,participants,slot_id,message,details,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',(id,'hash','booking','Test','test@example.invalid','12345678','one-hour','Boudha','2099-01-01','11:00',n,'a','','{}',1,1));self.db.commit()
 def test_competing_confirmations(self):
  self.request('r1');self.request('r2')
  def accept(id):
   con=sqlite3.connect(self.path,timeout=10)
   try:con.execute("UPDATE requests SET status='confirmed' WHERE id=?",(id,));con.commit();return True
   except sqlite3.IntegrityError:con.rollback();return False
   finally:con.close()
  with concurrent.futures.ThreadPoolExecutor(2) as ex:results=list(ex.map(accept,['r1','r2']))
  self.assertEqual(sum(results),1)
  self.assertEqual(self.db.execute("SELECT SUM(participants) FROM requests WHERE status='confirmed'").fetchone()[0],2)
 def test_cancellation_releases_capacity(self):
  self.request('r1');self.request('r2');self.db.execute("UPDATE requests SET status='confirmed' WHERE id='r1'");self.db.execute("UPDATE requests SET status='cancelled' WHERE id='r1'");self.db.execute("UPDATE requests SET status='confirmed' WHERE id='r2'")
 def test_overlapping_sessions_rejected(self):
  with self.assertRaises(sqlite3.IntegrityError):self.slot('b','11:30','12:30')
 def test_back_to_back_sessions_allowed(self):self.slot('b','12:00','13:00')
 def test_closed_confirmed_session_still_blocks_overlap(self):
  self.request('r1');self.db.execute("UPDATE requests SET status='confirmed' WHERE id='r1'");self.db.execute("UPDATE slots SET active=0 WHERE id='a'");self.db.commit()
  with self.assertRaises(sqlite3.IntegrityError):self.slot('b','11:30','12:30')
 def test_wrong_studio_rejected(self):
  self.request('r1')
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("UPDATE requests SET status='confirmed',studio='Thamel' WHERE id='r1'")
 def test_capacity_cannot_shrink_below_bookings(self):
  self.request('r1');self.db.execute("UPDATE requests SET status='confirmed' WHERE id='r1'")
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("UPDATE slots SET capacity=1 WHERE id='a'")
 def test_confirmed_session_cannot_move(self):
  self.request('r1');self.db.execute("UPDATE requests SET status='confirmed' WHERE id='r1'")
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("UPDATE slots SET time='12:00' WHERE id='a'")
 def test_new_requests_must_be_pending(self):
  self.request('r1')
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute("INSERT INTO requests SELECT 'r2',token_hash,kind,name,email,phone,experience,studio,date,time,participants,slot_id,message,details,'confirmed',staff_note,created_at,updated_at FROM requests WHERE id='r1'")
if __name__=='__main__':unittest.main(verbosity=2)
