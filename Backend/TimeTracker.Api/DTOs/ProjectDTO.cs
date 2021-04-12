using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTracker.Api.DTOs {
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public UserDTO Teacher { get; set; }
        public List<UserDTO> Students { get; set; }
        public string ClientName { get; set; }
        public string Description { get; set; }
        public DateTime? ArchivedDate { get; set; }
        public DateTime CreatedTime { get; set; }
        public string InviteCode { get; set; }
        public List<TagDTO> Tags { get; set; }
    }
}