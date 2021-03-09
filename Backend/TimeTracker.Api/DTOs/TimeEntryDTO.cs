using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs
{
    public class TimeEntryDTO
    {
        public int Id { get; set; }
        public DateTime LastModified { get; set; }
        public DateTime CreatedTime { get; set; }
        public double Length { get; set; }
        public string Notes { get; set; }
        public int ProjectId { get; set;}
        public DateTime Day { get; set; }
    }
}
