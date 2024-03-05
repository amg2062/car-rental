using CarsIntegration.Models;
using CarsIntegration.Repository.Interfaces;
using CarsIntegration.Repository.Interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Security.Cryptography;
namespace CarsIntegration.Repository
{
    public class UserRepo : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepo(string connectionString)
        {
            _connectionString = "Data Source=APINP-ELPTXZHFJ\\SQLEXPRESS02;Initial Catalog=carRental;User ID=tap2023;Password=tap2023;Encrypt=False";
        }

        //

        public string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
        //
        public Users GetUserByUsername(string username)
        {
            Users user = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Users WHERE Username = @Username";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new Users()
                            {
                                Username = (string)reader["Username"],
                                Password = (string)reader["Password"]
                            };
                        }
                    }
                }
            }

            return user;
        }

        /*public Users GetUserByUsernameAndPassword(string username, string password)
        {
            Users user = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Users WHERE Username = @Username";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedHashedPassword = (string)reader["Password"];
                            string hashedPassword = HashPassword(password);

                            if (storedHashedPassword == hashedPassword)
                            {
                                user = new Users()
                                {
                                    Username = (string)reader["Username"],
                                    // Password is not stored for security reasons
                                };
                            }
                        }
                    }
                }
            }

            return user;
        }
*/


        public (int UserID, string Username, string Password,string role) GetUserByUsernameAndPassword(int UserID, string username, string password,string role)
        {
            (int UserID, string Username, string Password,string Role) user = (0, null, null,null);

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT UserID, Username, Password ,Role FROM Users WHERE Username = @Username";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedHashedPassword = (string)reader["Password"];
                            string hashedPassword = HashPassword(password);

                            if (storedHashedPassword == hashedPassword)
                            {
                                user = ( (int)reader["UserID"], (string)reader["Username"], (string)reader["Password"],(string)reader["Role"]); // Password is not stored for security reasons
                            }
                        }
                    }
                }
            }

            return user;
        }

        public Users AddUser(Users user)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Users (Username, Password, Role) VALUES (@Username, @Password, @Role)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    string hashedPassword = HashPassword(user.Password);
                    command.Parameters.AddWithValue("@Username", user.Username);
                    command.Parameters.AddWithValue("@Password", hashedPassword);
                    if (string.IsNullOrEmpty(user.Role))
                    {
                        command.Parameters.AddWithValue("@Role", DBNull.Value);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@Role", user.Role);
                    }
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }

            return user;
        }
    }
}