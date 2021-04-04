using System;

namespace TimeTracker.Database.Models
{
    public class TimeEntry
    {
        public int Id { get; set; }
        public User User { get; set; }
        public DateTime CreatedTime { get; set; }
        public double Length { get; set; }
        public string Notes { get; set; }
        public Project Project { get; set; }
        public DateTime Day { get; set; }
        public DateTime LastModified { get; set; }

    }
}
