using System.Collections.Generic;

namespace TimeTracker.Api.DTOs {
    public class LengthReportDTO {
        public int ProjectId {get; set;}
        public List<UserTimeEntryLengthDTO> UserTimeEntries {get; set;}
    }
}