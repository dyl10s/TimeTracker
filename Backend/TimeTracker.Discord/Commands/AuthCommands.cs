﻿using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace TimeTracker.Discord.Commands
{
    public class AuthCommands : ModuleBase<SocketCommandContext>
    {
        MainDb database;
        IConfiguration configuration;

        public AuthCommands(MainDb db, IConfiguration config)
        {
            database = db;
            configuration = config;
        }

        [Command("login")]
        [Summary("Allows the user to link their Discord account with their NTime account.")]
        public async Task Login()
        {
            var currentUser = Context.User;

            // Check to make sure the user is not already linked
            var alreadyLinkedUser = await database.Users
                .AsQueryable()
                .Where(x => x.DiscordId == currentUser.Id.ToString())
                .FirstOrDefaultAsync();

            if (alreadyLinkedUser != null)
            {
                await ReplyAsync(
                    $@"{currentUser.Mention} your account is already linked with the email, {alreadyLinkedUser.Email}." +
                    "If you would like to unlink you account you can use the `!unlink` command."
                );
                return;
            }

            var linkKey = Guid.NewGuid().ToString().Replace("-", "") + Guid.NewGuid().ToString().Replace("-", "");
            var discordId = currentUser.Id;

            var discordLink = new DiscordLink()
            {
                DiscordId = discordId.ToString(),
                LinkKey = linkKey
            };

            database.Add(discordLink);
            await database.SaveChangesAsync();

            await ReplyAsync($"{currentUser.Mention} a direct message has been sent with further instructions for setting up your account.");

            await currentUser.SendMessageAsync(
                "Please login to your NTime account using the following link to link your discord account to your NTime account " +
                configuration["WebsiteLink"] + "auth/login?discordLink=" + linkKey
            );
        }

        [Command("unlink")]
        [Summary("Allows the user to unlink their Discord account with their NTime account.")]
        public async Task Unlink()
        {
            var currentUser = Context.User;
            var linkedUser = await database.Users
                .AsQueryable()
                .Where(x => x.DiscordId == currentUser.Id.ToString())
                .FirstOrDefaultAsync();

            if(linkedUser == null)
            {
                await ReplyAsync("Your Discord account is currently not linked to any NTime account.");
                return;
            }

            linkedUser.DiscordId = null;
            await database.SaveChangesAsync();

            await ReplyAsync("Your Discord account has been unlinked from your NTime account.");
        }
    }
}
