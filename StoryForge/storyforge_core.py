import sqlite3
import uuid

class StoryForgeCore:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        # Creates necessary tables if they do not exist
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT,
                series TEXT,
                content TEXT
            );
        ''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS decision_points (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                outcome_ids TEXT,
                FOREIGN KEY (story_id) REFERENCES stories (id)
            );
        ''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id INTEGER NOT NULL,
                user_choices TEXT,
                FOREIGN KEY (story_id) REFERENCES stories (id)
            );
        ''')

    def create_story(self, story_name, category=None, series=None, content=''):
        # Inserts a new story into the stories table
        self.cursor.execute('INSERT INTO stories (name, category, series, content) VALUES (?, ?, ?, ?)',
                            (story_name, category, series, content))
        self.conn.commit()
        return self.cursor.lastrowid
    

    def edit_story(self, story_id, new_content):
        # Updates the content of an existing story
        self.cursor.execute('UPDATE stories SET content = ? WHERE id = ?', (new_content, story_id))
        self.conn.commit()

    def list_stories(self):
        # Retrieves all stories from the stories table
        self.cursor.execute('SELECT id, name FROM stories')
        return self.cursor.fetchall()

    def add_decision_point(self, story_id, decision_text, outcome_ids):
        # Inserts a new decision point into the decision_points table
        self.cursor.execute('INSERT INTO decision_points (story_id, text, outcome_ids) VALUES (?, ?, ?)',
                            (story_id, decision_text, ','.join(outcome_ids)))
        self.conn.commit()
        return self.cursor.lastrowid

    def get_story(self, story_id):
        # Retrieves a single story by id
        self.cursor.execute('SELECT * FROM stories WHERE id = ?', (story_id,))
        row = self.cursor.fetchone()
        if row:
            return {
                'id': row[0],
                'name': row[1],
                'category': row[2],
                'series': row[3],
                'content': row[4]
            }
        else:
            return None

    def load_decision_points(self, story_id):
        # Retrieves all decision points for a specific story
        self.cursor.execute('SELECT * FROM decision_points WHERE story_id = ?', (story_id,))
        return [{'id': row[0], 'story_id': row[1], 'text': row[2], 'outcome_ids': row[3].split(',')} for row in self.cursor.fetchall()]

    def save_user_progress(self, story_id, user_choices):
        # Inserts or updates user progress for a story
        self.cursor.execute('INSERT OR REPLACE INTO user_progress (story_id, user_choices) VALUES (?, ?)',
                            (story_id, ','.join(user_choices)))
        self.conn.commit()
        return self.cursor.lastrowid

    def load_user_progress(self, story_id):
        # Retrieves user progress for a specific story
        self.cursor.execute('SELECT * FROM user_progress WHERE story_id = ?', (story_id,))
        row = self.cursor.fetchone()
        if row:
            return {
                'id': row[0],
                'story_id': row[1],
                'user_choices': row[2].split(',')
            }
        else:
            return None

    def close(self):
        # Closes the database connection
        self.conn.close()