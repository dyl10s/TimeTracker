using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using TimeTracker.Api.Database.Models;

namespace TimeTracker.Api.Database
{
    public class MainDb : DbContext
    {
        IConfiguration configuration;

        public MainDb(IConfiguration config)
        {
            configuration = config;
        }

        // This is where the database tables are defined
        public DbSet<TimeEntry> TimeEntries { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Timer> Timers { get; set; }
        public DbSet<Tag> Tags { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(configuration.GetConnectionString("Database"));
            base.OnConfiguring(optionsBuilder);
        }
    }
}
