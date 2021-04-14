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
    public class TimeEntryCommands: ModuleBase<SocketCommandContext> {
        MainDb database;
        CommandService commandService;

        public TimeEntryCommands(CommandService commandService, MainDb database)
        {
            this.database = database;
            this.commandService = commandService;
        }

        [Command("create")]
        [Summary("Create a time entry for the current day.")]
        public async Task Create([Remainder] string parameters)
        {
            User user = database.Users
                .AsQueryable()
                .FirstOrDefault(u => u.DiscordId == Context.User.Id.ToString());

            if(user == null) {
                await Context.Message.ReplyAsync("Your Discord account is not currently linked to an NTime account. Use `!login` to link your accounts together.");
                return;
            }

            string[] paramArray = parameters.Split(" ");

            if(paramArray.Length < 2){
                await Context.Message.ReplyAsync("You are missing a parameter in the command.");
                return;
            }

            if(int.Parse(paramArray[0]).ToString() == ""){
                await Context.Message.ReplyAsync("Project ID should be an integer.");
                return;
            }

            if(int.Parse(paramArray[1]).ToString() == ""){
                await Context.Message.ReplyAsync("Length of TimeEntry should be an integer.");
                return;
            }

            Project project = await database.Projects
                .AsQueryable()
                .FirstOrDefaultAsync(x => x.Id == int.Parse(paramArray[0]) && x.ArchivedDate == null);

            if(project == null){
                await Context.Message.ReplyAsync("No projects match the ID listed.");
                return;
            }

            String notes = null;

            if(paramArray.ElementAtOrDefault(2) != null) {
                notes = paramArray[2];
            }

            var newTimeEntry = new TimeEntry() 
            { 
                CreatedTime = DateTime.UtcNow,
                Day = DateTime.UtcNow,
                LastModified = DateTime.UtcNow,
                Length = int.Parse(paramArray[1]),
                Notes = notes,
                Project = project,
                User = user
            };

            database.TimeEntries.Add(newTimeEntry);
            await database.SaveChangesAsync();

            EmbedBuilder embedBuilder = new EmbedBuilder()
            {
                Color = new Color(35, 45, 154),
                Title = "New TimeEntry",
                Description = "Successfully created a new TimeEntry with Id " + newTimeEntry.Id,
            };

            embedBuilder.AddField(field => {
                field.Name = "Project";
                field.Value = newTimeEntry.Project.Name;
                field.IsInline = false;
            });

            embedBuilder.AddField(field => {
                field.Name = "Day";
                field.Value = DateTime.UtcNow;
                field.IsInline = false;
            });

            embedBuilder.AddField(field => {
                field.Name = "Length";
                field.Value = newTimeEntry.Length;
                field.IsInline = false;
            });

            if(newTimeEntry.Notes != null){
                embedBuilder.AddField(field => {
                    field.Name = "Notes";
                    field.Value = newTimeEntry.Notes;
                    field.IsInline = false;
                });
            }

            await Context.Message.ReplyAsync("", false, embedBuilder.Build());

            return;
        }
    }
}