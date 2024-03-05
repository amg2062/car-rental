using CarsIntegration.Models;

namespace CarsIntegration.Repository.Interfaces
{
    public interface IUserRepository
    {
        Users GetUserByUsername(string username);
        (int UserID, string Username, string Password, string role) GetUserByUsernameAndPassword(int UserID, string username, string password,string role);
        Users AddUser(Users user);
    }
}