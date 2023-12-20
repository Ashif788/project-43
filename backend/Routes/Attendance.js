const express = require('express');
const router = express.Router();
const mysql = require('mysql');

module.exports = (db) => {

    router.post('/api/submitAttendance', (req, res) => {
        const { attendanceData, date ,ClassID,IID} = req.body;
        
        
        
        const sql = 'INSERT INTO Attendance(Attendance_Date, Status, AStudentID, AClassID, AInstituteID) VALUES (?, ?, ?, ?, ?)';

        
        
        attendanceData.forEach((attendance) => {
            const { regno, status } = attendance;


            const values = [date, status, regno, ClassID, IID];

            db.query(sql, values, (error, results) => {
                if (error) {
                    console.error('Error inserting attendance:', error);
                }
            });
        });

        res.status(200).json({ message: 'Attendance submitted successfully' });
    });

    router.get('/api/attendancecheck/:TId', (req, res) => {
      const { date } = req.query;
      const iid = req.params.TId;
      
      
      
    
      const sql = 'SELECT Attendance_Date FROM Attendance WHERE Attendance_Date = ? AND AClassID = (SELECT Class_ID from class where Class_TeacherID=?)';
    
      db.query(sql, [ date,iid], (error, result) => {
        if (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Data retrieval failed' });
        } else {
          console.log('Data fetched successfully');
          res.json(result);
        }
      });
    });

    router.get('/api/totalpresent/:TId', (req, res) => {
      const { date } = req.query;
      const iid = req.params.TId;
      
      
    
      const sql = 'SELECT Count(Status) "totalpresent" FROM Attendance WHERE (Attendance_Date = ? AND status= "Present") AND AClassID = (SELECT Class_ID from class where Class_TeacherID=?)';
    
      db.query(sql, [ date,iid], (error, result) => {
        if (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Data retrieval failed' });
        } else {
          console.log('Data fetched successfully',result);
          res.json(result);
        }
      });
    });
    
    router.get('/api/totalabsent/:TId', (req, res) => {
      const { date } = req.query;
      const iid = req.params.TId;
      
      
    
      const sql = 'SELECT Count(Status) "totalabsent" FROM Attendance WHERE (Attendance_Date = ? AND status= "Absent") AND AClassID = (SELECT Class_ID from class where Class_TeacherID=?)';
    
      db.query(sql, [ date,iid], (error, result) => {
        if (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Data retrieval failed' });
        } else {
          console.log('Data fetched successfully',result);
          res.json(result);
        }
      });
    });
    
    return router;
};
