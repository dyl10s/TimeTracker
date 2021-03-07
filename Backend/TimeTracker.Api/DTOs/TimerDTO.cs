using System;

namespace TimeTracker.Api.DTOs {
    public class TimerDTO {
        public int Id;
        public DateTime StartTime;
        public string Notes;
        public int ProjectId;
    }
}