import sqlite3
from sqlite3 import Error

class StoryForgeDataStorage:
    def __init__(self, db_file):
        self.conn = None
        self.cursor = None
        self.db_file = db_file
        self.create_connection()

    def create_connection(self):
        try:
            self.conn = sqlite3.connect(self.db_file)
            self.cursor = self.conn.cursor()
            self.create_tables()
        except Error as e:
            print(e)

    def create_tables(self):
        stories_table_query = """
            CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                series TEXT,
                content TEXT
            );
        """
        decision_points_table_query = """
            CREATE TABLE IF NOT EXISTS decision_points (
                id INTEGER PRIMARY KEY,
                story_id INTEGER NOT NULL,
                text TEXT NOT NULL,
                outcome_ids TEXT,
                FOREIGN KEY (story_id) REFERENCES stories (id)
            );
        """
        progress_table_query = """
            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY,
                story_id INTEGER NOT NULL,
                user_choices TEXT,
                FOREIGN KEY (story_id) REFERENCES stories (id)
            );
        """
        self.cursor.execute(stories_table_query)
        self.cursor.execute(decision_points_table_query)
        self.cursor.execute(progress_table_query)

    def save_story(self, story_data):
        query = """
            INSERT INTO stories (name, category, series, content)
            VALUES (?, ?, ?, ?);
        """
        self.cursor.execute(query, (story_data['name'], story_data['category'], story_data['series'], story_data['content']))
        self.conn.commit()
        return self.cursor.lastrowid

    def load_story(self, story_id):
        query = """
            SELECT * FROM stories WHERE id = ?;
        """
        self.cursor.execute(query, (story_id,))
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

    def save_decision_point(self, decision_point_data):
        query = """
            INSERT INTO decision_points (story_id, text, outcome_ids)
            VALUES (?, ?, ?);
        """
        self.cursor.execute(query, (decision_point_data['story_id'], decision_point_data['text'], decision_point_data['outcome_ids']))
        self.conn.commit()
        return self.cursor.lastrowid

    def load_decision_points(self, story_id):
        query = """
            SELECT * FROM decision_points WHERE story_id = ?;
        """
        self.cursor.execute(query, (story_id,))
        rows = self.cursor.fetchall()
        decision_points = []
        for row in rows:
            decision_points.append({
                'id': row[0],
                'story_id': row[1],
                'text': row[2],
                'outcome_ids': row[3]
            })
        return decision_points

    def save_progress(self, progress_data):
        query = """
            INSERT INTO progress (story_id, user_choices)
            VALUES (?, ?);
        """
        self.cursor.execute(query, (progress_data['story_id'], progress_data['user_choices']))
        self.conn.commit()
        return self.cursor.lastrowid

    def load_progress(self, story_id):
        query = """
            SELECT * FROM progress WHERE story_id = ?;
        """
        self.cursor.execute(query, (story_id,))
        row = self.cursor.fetchone()
        if row:
            return {
                'id': row[0],
                'story_id': row[1],
                'user_choices': row[2]
            }
        else:
            return None

    def close_connection(self):
        if self.conn:
            self.conn.close()

if __name__ == '__main__':
    data_storage = StoryForgeDataStorage('storyforge.db')
    # Use the data storage methods to save and load data
    data_storage.close_connection()