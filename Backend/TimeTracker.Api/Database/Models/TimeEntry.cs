using System;

namespace TimeTracker.Api.Models
{
    public class TimeEntry
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set;}
        public DateTime EndTime { get; set; }
        public string Message { get; set;}
    }
}
