using System.Collections.Generic;

namespace TimeTracker.Api.DTOs {
    public class ProfileDTO {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<string> Projects { get; set; }
    }
}