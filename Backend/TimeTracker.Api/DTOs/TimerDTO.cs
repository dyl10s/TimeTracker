using System;

namespace TimeTracker.Api.DTOs {
    public class TimerDTO {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public string Notes { get; set; }
        public int ProjectId { get; set; }
    }
}