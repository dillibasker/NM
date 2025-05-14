import sqlite3
from datetime import datetime
import json

class Database:
    def __init__(self, db_path='quality_control.db'):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Create products table
        c.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                status TEXT NOT NULL,
                model TEXT NOT NULL,
                certification_present BOOLEAN NOT NULL,
                defects TEXT,
                confidence REAL NOT NULL,
                image_data TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_scan_result(self, result):
        """Add a new scan result to the database"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO products (
                id, timestamp, status, model,
                certification_present, defects,
                confidence, image_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            result['id'],
            result['timestamp'],
            result['status'],
            result['model'],
            result['certificationPresent'],
            json.dumps(result['defects']),
            result['confidence'],
            result.get('image', '')
        ))
        
        conn.commit()
        conn.close()
    
    def get_scan_history(self, limit=50):
        """Get recent scan history"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''
            SELECT * FROM products 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        rows = c.fetchall()
        columns = [description[0] for description in c.description]
        
        results = []
        for row in rows:
            result = dict(zip(columns, row))
            result['defects'] = json.loads(result['defects'])
            results.append(result)
        
        conn.close()
        return results
    
    def get_statistics(self):
        """Get scanning statistics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                AVG(confidence) as avg_confidence
            FROM products
        ''')
        
        stats = dict(zip(['total', 'approved', 'rejected', 'avg_confidence'], c.fetchone()))
        
        conn.close()
        return stats