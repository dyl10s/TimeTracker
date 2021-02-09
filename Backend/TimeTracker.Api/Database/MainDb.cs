using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using TimeTracker.Api.Database.Models;

namespace TimeTracker.Api.Database
{
    public class MainDb : DbContext
    {
        IConfiguration configuration;
        bool isTestDb = false;

        public MainDb(IConfiguration config)
        {
            configuration = config;
        }

        public MainDb(DbContextOptions<MainDb> options) : base (options)
        {
            isTestDb = true;    
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
            if(!isTestDb)
            {
                optionsBuilder.UseNpgsql(configuration.GetConnectionString("Database"));
            }
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>(e =>
            {
                e.HasIndex(i => i.Email).IsUnique();
            });
        }
    }
}
