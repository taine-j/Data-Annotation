import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from storyforge_core import StoryForgeCore

class StoryForgeGUI:
    def __init__(self, master):
        self.master = master
        self.core = StoryForgeCore('./storyforge.db')  # Adjusted to use SQLite database path
        self.current_story_id = None

        # Create main frames
        self.nav_frame = tk.Frame(self.master)
        self.nav_frame.pack(side=tk.LEFT, fill=tk.Y)

        self.content_frame = tk.Frame(self.master)
        self.content_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)


        # Navigation frame widgets
        self.story_listbox = tk.Listbox(self.nav_frame)
        self.story_listbox.pack(fill=tk.Y)
        self.story_listbox.bind('<<ListboxSelect>>', self.on_story_select)

        self.new_story_button = tk.Button(self.nav_frame, text='New Story', command=self.on_new_story)
        self.new_story_button.pack()

        # Content frame widgets
        self.story_name_label = tk.Label(self.content_frame, text='Story Name:')
        self.story_name_label.pack()

        self.story_name_entry = tk.Entry(self.content_frame)
        self.story_name_entry.pack(fill=tk.X)

        self.story_content_text = tk.Text(self.content_frame)
        self.story_content_text.pack(fill=tk.BOTH, expand=True)

        self.save_story_button = tk.Button(self.content_frame, text='Save Story', command=self.on_save_story)
        self.save_story_button.pack(side=tk.RIGHT)

        self.resume_story_button = tk.Button(self.content_frame, text='Resume Story', command=self.on_resume_story)
        self.resume_story_button.pack(side=tk.RIGHT)

        # Initialize story list
        self.update_story_list()

    def on_story_select(self, event):
        if not self.story_listbox.curselection():
            return
        index = self.story_listbox.curselection()[0]
        story_id = self.story_listbox.get(index)
        self.current_story_id = story_id
        self.update_story_content()

    
    def on_new_story(self):
        story_name = self.story_name_entry.get()
        if story_name:
            story_id = self.core.create_story(story_name)
            self.update_story_list()
            self.story_listbox.select_set(self.story_listbox.size()-1)  # Select new story in listbox
            self.update_story_content()

    def on_save_story(self):
        story_content = self.story_content_text.get('1.0', 'end-1c')
        self.core.edit_story(self.current_story_id, story_content)

    def on_resume_story(self):
        # Placeholder for functionality
        pass

    def update_story_list(self):
        self.story_listbox.delete(0, tk.END)
        stories = self.core.list_stories()
        for story_id, name in stories:
            self.story_listbox.insert(tk.END, name)  # Insert story names

    def update_story_content(self):
        if self.current_story_id:
            story_data = self.core.get_story(self.current_story_id)
            if story_data:
                self.story_name_entry.delete(0, tk.END)
                self.story_name_entry.insert(0, story_data['name'])
                self.story_content_text.delete('1.0', tk.END)
                self.story_content_text.insert('1.0', story_data['content'])

if __name__ == '__main__':
    root = tk.Tk()
    root.title('StoryForge')
    app = StoryForgeGUI(root)
    root.mainloop()