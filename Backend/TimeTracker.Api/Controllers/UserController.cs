using Microsoft.AspNetCore.Mvc;        // ControllerBase
using System.Threading.Tasks;          // Task
using TimeTracker.Api.DTOs;            // UserDTO
using TimeTracker.Api.Database;        // MainDb
using Microsoft.EntityFrameworkCore;   // .AsNoTracking()
using System.Linq;                     // .Where()

namespace TimeTracker.Api.Controllers {
    public class UserController : ControllerBase {

        MainDb database;

        public UserController(MainDb database) {
            this.database = database;
        }

        [HttpGet("{id}")]
        public async Task<GenericResponseDTO<UserDTO>> Get(int id) {

            var queryResult = await database.Users.AsNoTracking()
                .Where(user => user.Id == id)
                .FirstOrDefaultAsync();

            if(queryResult == default(Database.Models.User)) {
                return new GenericResponseDTO<UserDTO> {
                    Message = "No matching User ID found.",
                    Success = false
                };
            }

            return new GenericResponseDTO<UserDTO>() {
                Data = new UserDTO() {
                    Email = queryResult.Email,
                    Name = queryResult.Name
                },
                Success = true
            };
        }
    }
    
}