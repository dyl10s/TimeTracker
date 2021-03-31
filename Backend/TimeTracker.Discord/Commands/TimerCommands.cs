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
        [Summary("starts a new timer if one isn't already running")]
        public async Task Start() {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your discord account is not currently linked to an NTime account. Use !login to link your accounts together.");
                return;
            }

            List<Project> projects = database.Projects
                .AsQueryable()
                .Where(project => project.Students.Any(s => s.Id == user.Id) || project.Teacher.Id == user.Id)
                .ToList();

            projects.Sort((a, b) => a.Name.CompareTo(b.Name));
            
            if(projects.Count == 0) {
                await Context.Message.ReplyAsync("You're not currently part of any projects.");
                return;
            } else if(projects.Count == 1) {
                await Context.Message.ReplyAsync("Timer successfully started for '" + projects[0].Name + "'.");
                return;
            }

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "Projects",
                Description = "Multiple projects were found, please select one to start a timer for from the list:"
            };

            for(int i = 0; i < projects.Count; i++) {
                embedBuilder.AddField(field => {
                    field.Name = projects[i].Name;
                    field.Value = "!start " + (i + 1);
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return; 
        }

        //TODO: don't list projects that already have an active timer
        [Command("start")]
        [Summary("starts a new timer if one isn't already running")]
        public async Task Start(int projectNumber) {

            if(projectNumber < 0)
                return;

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your discord account is not currently linked to an NTime account. Use !login to link your accounts together.");
                return;
            }

            List<Project> projects = database.Projects
                .AsQueryable()
                .Where(project => project.Students.Any(s => s.Id == user.Id) || project.Teacher.Id == user.Id)
                .ToList();

            projects.Sort((a, b) => a.Name.CompareTo(b.Name));
            
            if(projects.Count == 0) {
                await Context.Message.ReplyAsync("You're not currently part of any projects.");
                return;
            } else if(projectNumber - 1 >= projects.Count) {
                await Context.Message.ReplyAsync("Project number was out of range. There are only " + projects.Count + " projects that you're a part of.");
                return;
            }

            Timer oldTimer = database.Timers
                .AsQueryable()
                .FirstOrDefault(timer => timer.User.Id == user.Id && timer.Project.Id == projects[projectNumber - 1].Id);

            if(oldTimer != null) {
                await Context.Message.ReplyAsync("An active timer was already found for the given project. If you'd like to stop this timer, use the '!stop' command.");
                return;
            }

            database.Timers.Add(new Timer() {
                User = user,
                StartTime = DateTime.UtcNow,
                Project = projects[projectNumber - 1]
            });

            database.SaveChanges();

            await Context.Message.ReplyAsync("Timer successfully started for '" + projects[projectNumber - 1].Name + "'. Use '!stop' to stop the timer and create a new time entry from it.");

            return; 
        }

        [Command("stop")]
        [Summary("stops an active timer and creates a new time entry from it")]
        public async Task Stop() {

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your discord account is not currently linked to an NTime account. Use !login to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList();

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("There are not currently any timers for you to stop.");
                return;
            } else if(timers.Count == 1) {
                await Context.Message.ReplyAsync("The active timer for project '" + timers[0].Project.Name + "' has been stopped, and a new time entry for it has been created.");
                return;
            }

            timers.Sort((a, b) => a.StartTime.CompareTo(b.StartTime));

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "Timers",
                Description = "Multiple timers were found, please select one to stop from the list:"
            };

            for(int i = 0; i < timers.Count; i++) {
                embedBuilder.AddField(field => {
                    field.Name = timers[i].StartTime.ToString() + " - " + timers[i].Project.Name;
                    field.Value = "!stop " + (i + 1);
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return;
        }

        [Command("stop")]
        [Summary("stops an active timer and creates a new time entry from it")]
        public async Task Stop(int timerNumber) {

            if(timerNumber < 0)
                return;

            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());
            
            if(user == null) {
                await Context.Message.ReplyAsync("Your discord account is not currently linked to an NTime account. Use !login to link your accounts together.");
                return;
            }

            List<Timer> timers = database.Timers
                .AsQueryable()
                .Where(timer => timer.User.Id == user.Id)
                .ToList();

            timers.Sort((a, b) => a.StartTime.CompareTo(b.StartTime));

            if(timers.Count == 0) {
                await Context.Message.ReplyAsync("There are not currently any timers for you to stop.");
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

            await Context.Message.ReplyAsync("Timer successfully stopped, a time entry for project " + timers[timerNumber - 1].Project.Name + " was created with " + Math.Floor(timeEntry.Length) + " minutes on it.");

            return;
        }

        [Command("timers")]
        [Summary("lists all active timers")]
        public async Task ListTimers() {
            return;
        }
    }
}