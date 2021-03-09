using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class UserTimeEntriesDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<TimeEntryDTO> TimeEntries { get; set; }
    }
}
