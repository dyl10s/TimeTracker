using Discord;
using Discord.Commands;
using System.Threading.Tasks;
using TimeTracker.Database;
using TimeTracker.Database.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace TimeTracker.Discord.Commands
{
    public class TimerCommands: ModuleBase<SocketCommandContext> {
        MainDb database;
        CommandService commandService;

        public TimerCommands(CommandService commandService, MainDb database)
        {
            this.database = database;
            this.commandService = commandService;
        }

        [Command("start")]
        [Summary("Starts a new timer for a project.")]
        public async Task Start() {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Project> projectsWithTimers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList()
                .Join(database.Projects,
                    timer => timer.Project,
                    project => project,
                    (timer, project) => project)
                .ToList();

            List<Project> projectsWithoutTimers = database.Projects
                .AsQueryable()
                .Where(project => (project.Students.Any(s => s.Id == user.Id) || project.Teacher.Id == user.Id))
                .ToList()
                .Except(projectsWithTimers)
                .ToList();
            
            projectsWithoutTimers.Sort((a, b) => a.Name.CompareTo(b.Name));
            
            if(projectsWithoutTimers.Count == 0) {
                await Context.Message.ReplyAsync("You're not part of any projects yet.");
                return;
            } else if(projectsWithoutTimers.Count == 1) {

                database.Timers.Add(new Timer() {
                    User = user,
                    StartTime = DateTime.UtcNow,
                    Project = projectsWithoutTimers[0]
                });

                database.SaveChanges();

                await Context.Message.ReplyAsync("Timer started for the project **" + projectsWithoutTimers[0].Name + "**. Use `!stop` to stop the timer and create a new time entry from it.");
                return;
            }

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "Projects",
                Description = "Multiple projects without timers were found, please select one to start a timer for:"
            };

            for(int i = 0; i < projectsWithoutTimers.Count; i++) {
                embedBuilder.AddField(field => {
                    field.Name = projectsWithoutTimers[i].Name;
                    field.Value = "!start " + (i + 1);
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return; 
        }

        [Command("start")]
        public async Task Start(int projectNumber) {

            if(projectNumber <= 0)
                return;

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Project> projectsWithTimers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList()
                .Join(database.Projects,
                    timer => timer.Project,
                    project => project,
                    (timer, project) => project)
                .ToList();

            List<Project> projectsWithoutTimers = database.Projects
                .AsQueryable()
                .Where(project => (project.Students.Any(s => s.Id == user.Id) || project.Teacher.Id == user.Id))
                .ToList()
                .Except(projectsWithTimers)
                .ToList();
            
            projectsWithoutTimers.Sort((a, b) => a.Name.CompareTo(b.Name));
            
            if(projectsWithoutTimers.Count == 0) {
                await Context.Message.ReplyAsync("You're not currently part of any projects.");
                return;
            } else if(projectNumber - 1 >= projectsWithoutTimers.Count) {
                await Context.Message.ReplyAsync("Project number was out of range. There are only " + projectsWithoutTimers.Count + " projects without timers that you're a part of.");
                return;
            }

            database.Timers.Add(new Timer() {
                User = user,
                StartTime = DateTime.UtcNow,
                Project = projectsWithoutTimers[projectNumber - 1]
            });

            database.SaveChanges();

            await Context.Message.ReplyAsync("Timer started for the project **" + projectsWithoutTimers[projectNumber - 1].Name + "**. Use `!stop` to stop the timer and create a new time entry from it.");

            return; 
        }

        [Command("start")]
        public async Task Start(string projectName) {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Project> projectsWithoutTimers = database.Projects
                .AsQueryable()
                .Where(project => (project.Name.IndexOf(projectName) == 0) && (project.Students.Any(s => s.Id == user.Id) || project.Teacher.Id == user.Id))
                .ToList();
            
            if(projectsWithoutTimers.Count == 0) {
                await Context.Message.ReplyAsync("No project with that name was found.");
                return;
            }

            projectsWithoutTimers.Sort((a, b) => a.Name.CompareTo(b.Name));

            Timer oldTimer = database.Timers
                .AsQueryable()
                .FirstOrDefault(timer => timer.User.Id == user.Id && timer.Project.Id == projectsWithoutTimers[0].Id);

            if(oldTimer != null) {
                await Context.Message.ReplyAsync("An active timer was already found for the given project. If you'd like to stop this timer, use the `!stop` command.");
                return;
            }

            database.Timers.Add(new Timer() {
                User = user,
                StartTime = DateTime.UtcNow,
                Project = projectsWithoutTimers[0]
            });

            database.SaveChanges();

            await Context.Message.ReplyAsync("Timer started for the project **" + projectsWithoutTimers[0].Name + "**. Use `!stop` to stop the timer and create a new time entry from it.");

            return; 
        }

        [Command("stop")]
        [Summary("Stops an active timer and creates a new time entry from it.")]
        public async Task Stop() {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList();

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("There are no active timers to stop.");
                return;
            } else if(timers.Count == 1) {
                DateTime timeEntryCreationTime = DateTime.UtcNow;

                TimeEntry timeEntry = new TimeEntry{
                    CreatedTime = timeEntryCreationTime,
                    Notes = timers[0].Notes,
                    Project = timers[0].Project,
                    LastModified = timeEntryCreationTime,
                    User = user,
                    Length = (timeEntryCreationTime - timers[0].StartTime).TotalMinutes,
                    Day = timeEntryCreationTime
                };

                database.TimeEntries.Add(timeEntry);

                database.Timers.Remove(timers[0]);

                await database.SaveChangesAsync();

                await Context.Message.ReplyAsync("Timer stopped for the project **" + timers[0].Project.Name + "**, and a new time entry with " + Math.Floor(timeEntry.Length) + " minutes on it has been added.");
                
                return;
            }

            timers.Sort((a, b) => a.Project.Name.CompareTo(b.Project.Name));

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "Active Timers",
                Description = "Multiple projects with active timers were found, please select one to stop:"
            };

            for(int i = 0; i < timers.Count; i++) {
                embedBuilder.AddField(field => {
                    field.Name = timers[i].Project.Name + " (Active for " + Math.Floor((DateTime.UtcNow - timers[i].StartTime).TotalMinutes) + " minutes)";
                    field.Value = "!stop " + (i + 1);
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return;
        }

        [Command("stop")]
        public async Task Stop(int timerNumber) {

            if(timerNumber <= 0)
                return;

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList();

            timers.Sort((a, b) => a.Project.Name.CompareTo(b.Project.Name));

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("There aren't any timers for you to stop yet.");
                return;
            } else if(timerNumber - 1 >= timers.Count) {
                await Context.Message.ReplyAsync("Timer number was out of range. There are only " + timers.Count + " active timers.");
                return;
            }

            DateTime timeEntryCreationTime = DateTime.UtcNow;

            TimeEntry timeEntry = new TimeEntry{
                CreatedTime = timeEntryCreationTime,
                Notes = timers[timerNumber - 1].Notes,
                Project = timers[timerNumber - 1].Project,
                LastModified = timeEntryCreationTime,
                User = user,
                Length = (timeEntryCreationTime - timers[timerNumber - 1].StartTime).TotalMinutes,
                Day = timeEntryCreationTime
            };

            database.TimeEntries.Add(timeEntry);

            database.Timers.Remove(timers[timerNumber - 1]);

            await database.SaveChangesAsync();

            await Context.Message.ReplyAsync("Timer stopped for the project **" + timers[timerNumber - 1].Project.Name + "**, and a new time entry with " + Math.Floor(timeEntry.Length) + " minutes on it has been added.");

            return;
        }

        [Command("stop")]
        public async Task Stop(string projectName) {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.Project.Name.IndexOf(projectName) == 0 && timer.User.Id == user.Id)
                .ToList();

            timers.Sort((a, b) => a.Project.Name.CompareTo(b.Project.Name));

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("No active timer found for the given project name. (Use `!timers` to see which projects have active timers.)");
                return;
            }

            DateTime timeEntryCreationTime = DateTime.UtcNow;

            TimeEntry timeEntry = new TimeEntry{
                CreatedTime = timeEntryCreationTime,
                Notes = timers[0].Notes,
                Project = timers[0].Project,
                LastModified = timeEntryCreationTime,
                User = user,
                Length = (timeEntryCreationTime - timers[0].StartTime).TotalMinutes,
                Day = timeEntryCreationTime
            };

            database.TimeEntries.Add(timeEntry);

            database.Timers.Remove(timers[0]);

            await database.SaveChangesAsync();

            await Context.Message.ReplyAsync("Timer stopped for the project **" + timers[0].Project.Name + "**, and a new time entry with " + Math.Floor(timeEntry.Length) + " minutes on it has been added.");

            return;
        }

        [Command("stop")]
        public async Task Stop(params string[] projectNameAsArray) {

            string projectName = "";

            for(int i = 0; i < projectNameAsArray.Length; i++) {
                projectName += projectNameAsArray[i];
                if(i + 1 < projectNameAsArray.Length)
                    projectName += " ";
            }

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.Project.Name.IndexOf(projectName) == 0 && timer.User.Id == user.Id)
                .ToList();

            timers.Sort((a, b) => a.Project.Name.CompareTo(b.Project.Name));

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("No active timer found for the given project name. (Use `!timers` to see which projects have active timers.)");
                return;
            }

            DateTime timeEntryCreationTime = DateTime.UtcNow;

            TimeEntry timeEntry = new TimeEntry{
                CreatedTime = timeEntryCreationTime,
                Notes = timers[0].Notes,
                Project = timers[0].Project,
                LastModified = timeEntryCreationTime,
                User = user,
                Length = (timeEntryCreationTime - timers[0].StartTime).TotalMinutes,
                Day = timeEntryCreationTime
            };

            database.TimeEntries.Add(timeEntry);

            database.Timers.Remove(timers[0]);

            await database.SaveChangesAsync();

            await Context.Message.ReplyAsync("Timer stopped for the project **" + timers[0].Project.Name + "**, and a new time entry with " + Math.Floor(timeEntry.Length) + " minutes on it has been added.");

            return;
        }

        [Command("timers")]
        [Summary("Lists all active timers.")]
        public async Task ListTimers() {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList();

            timers.Sort((a, b) => a.Project.Name.CompareTo(b.Project.Name));

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("You have no active timers.");
                return;
            }

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "Active Timers",
                Description = ""
            };

            for(int i = 0; i < timers.Count; i++) {
                embedBuilder.AddField(field => {
                    field.Name = timers[i].Project.Name;
                    field.Value = "Active for " + Math.Floor((DateTime.UtcNow - timers[i].StartTime).TotalMinutes) + " minutes \n";
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return;
        }
    }
}