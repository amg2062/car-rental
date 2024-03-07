using CarsIntegration.Repository.Interfaces;
using CarsIntegration.Repository;
using System.Collections.Generic;
using System.Data.SqlClient;
using CarsIntegration.Models;
using Microsoft.VisualBasic.FileIO;
using System.Data.SqlTypes;
using System.Data;
using CarsIntegration.Controllers;

namespace CarsIntegration.Repository
{
    public class CarsRepo : ICars
    {
        private readonly string _connectionString;

        public CarsRepo(string connectionString)
        {
            _connectionString = "Data Source=APINP-ELPTXZHFJ\\SQLEXPRESS02;Initial Catalog=carRental;User ID=tap2023;Password=tap2023;Encrypt=False";
        }


        public IEnumerable<Cars> GetCars(DateTime startDate, DateTime endDate)
        {
            var cars = new List<Cars>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
            SELECT * FROM Cars
 WHERE NOT EXISTS (
     SELECT 1 FROM Reservations
     WHERE Reservations.CarID = Cars.CarID AND 
     ((ReservationStart <= @EndDate AND ReservationEnd >= @StartDate) OR 
     (ReservationStart >= @StartDate AND ReservationEnd <= @EndDate))
             )";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@StartDate", SqlDbType.DateTime2).Value = startDate;
                    command.Parameters.Add("@EndDate", SqlDbType.DateTime2).Value = endDate;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var car = new Cars()
                            {
                                CarID = (int)reader["CarID"],
                                Manufacturer = (string)reader["Manufacturer"],
                                Model = (string)reader["Model"],
                                TransmissionType = (string)reader["TransmissionType"],
                                NoOfSeats = (int)reader["NoOfSeats"],
                                EngineCapacity = (int)reader["EngineCapacity"],
                                CarType = (string)reader["CarType"],
                                YearOfManufacture = (int)reader["YearOfManufacture"],
                                FuelType = (string)reader["FuelType"],
                                Mileage = (int)reader["Mileage"],
                                Availability = (bool)reader["Availability"],
                                CostPerHour = (decimal)reader["CostPerHour"],
                                LocationOfCar = (string)reader["LocationOfCar"]
                            };

                            cars.Add(car);
                        }
                    }
                }
            }

            return cars;
        }

        /*        public Reservation CreateReservation(Reservation reservation)
                {
                    // Example validation logic
                    if (reservation.Status != "booked" && reservation.Status != "pending")
                    {
                        throw new ArgumentException("Invalid reservation status. Allowed values are 'booked' and 'pending'.");
                    }

                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        string query = "INSERT INTO Reservations (CarID, ReservationStart, ReservationEnd, TotalCarCost, Status, UserID) " +
                                       "VALUES (@CarID, @ReservationStart, @ReservationEnd, @TotalCarCost, @Status, @UserID)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@CarID", reservation.CarID);
                            command.Parameters.AddWithValue("@ReservationStart", reservation.ReservationStart);
                            command.Parameters.AddWithValue("@ReservationEnd", reservation.ReservationEnd);
                            command.Parameters.AddWithValue("@TotalCarCost", reservation.TotalCarCost);
                            command.Parameters.AddWithValue("@Status", reservation.Status);
                            command.Parameters.AddWithValue("@UserID", reservation.UserID);
                            connection.Open();
                            command.ExecuteNonQuery();
                        }
                    }

                    return reservation;
                }
        */

        public Models.Reservation CreateReservation(Models.Reservation reservation)
        {
            if (reservation.Status != "booked" && reservation.Status != "pending")
            {
                throw new ArgumentException("Invalid reservation status. Allowed values are 'booked' and 'pending'.");
            }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                // Step 1: Check for overlapping reservations
                string checkOverlapQuery = @"
            SELECT COUNT(*) FROM Reservations 
            WHERE CarID = @CarID 
            AND (
                (@ReservationStart BETWEEN ReservationStart AND ReservationEnd) 
                OR (@ReservationEnd BETWEEN ReservationStart AND ReservationEnd)
                OR (ReservationStart BETWEEN @ReservationStart AND @ReservationEnd)
                OR (ReservationEnd BETWEEN @ReservationStart AND @ReservationEnd)
            )";

                using (SqlCommand checkOverlapCommand = new SqlCommand(checkOverlapQuery, connection))
                {
                    checkOverlapCommand.Parameters.AddWithValue("@CarID", reservation.CarID);
                    checkOverlapCommand.Parameters.AddWithValue("@ReservationStart", reservation.ReservationStart);
                    checkOverlapCommand.Parameters.AddWithValue("@ReservationEnd", reservation.ReservationEnd);

                    connection.Open();
                    int overlapCount = (int)checkOverlapCommand.ExecuteScalar();

                    if (overlapCount > 0)
                    {
                        throw new ArgumentException("The requested dates are not available. The car is already reserved during the specified period.");
                    }
                }

                // Step 2: Insert the new reservation
                string insertReservationQuery = "INSERT INTO Reservations (CarID, ReservationStart, ReservationEnd, TotalCarCost, Status, UserID) " +
                                                "VALUES (@CarID, @ReservationStart, @ReservationEnd, @TotalCarCost, @Status, @UserID)";

                using (SqlCommand insertCommand = new SqlCommand(insertReservationQuery, connection))
                {
                    insertCommand.Parameters.AddWithValue("@CarID", reservation.CarID);
                    insertCommand.Parameters.AddWithValue("@ReservationStart", reservation.ReservationStart);
                    insertCommand.Parameters.AddWithValue("@ReservationEnd", reservation.ReservationEnd);
                    insertCommand.Parameters.AddWithValue("@TotalCarCost", reservation.TotalCarCost);
                    insertCommand.Parameters.AddWithValue("@Status", reservation.Status);
                    insertCommand.Parameters.AddWithValue("@UserID", reservation.UserID);

                    insertCommand.ExecuteNonQuery();
                }

                // Step 3: Update availability status of the reserved car
                string updateCarQuery = "UPDATE Cars SET Availability = 0 WHERE CarID = @CarID";

                using (SqlCommand updateCommand = new SqlCommand(updateCarQuery, connection))
                {
                    updateCommand.Parameters.AddWithValue("@CarID", reservation.CarID);
                    updateCommand.ExecuteNonQuery();
                }
            }

            return reservation;
        }


        public Models.Reservation GetReservationById(int id)
        {
            Models.Reservation reservation = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Reservations WHERE ReservationID = @ReservationID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ReservationID", id);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            reservation = new Models.Reservation()
                            {
                                ReservationID = (int)reader["ReservationID"],
                                CarID = (int)reader["CarID"],
                                ReservationStart = (DateTime)reader["ReservationStart"],
                                ReservationEnd = (DateTime)reader["ReservationEnd"],
                                TotalCarCost = (decimal)reader["TotalCarCost"],
                                Status = (string)reader["Status"],
                            };
                        }
                    }
                }
            }

            return reservation;
        }
        //


        //
        public IEnumerable<Reservation2> GetReservationsByUserIdWithCarDetails(int userId)
        {
            var reservations = new List<Reservation2>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
            SELECT r.ReservationID, r.CarID, r.ReservationStart, r.ReservationEnd, r.TotalCarCost, r.Status, 
                   c.Manufacturer, c.Model, c.TransmissionType, c.NoOfSeats, c.EngineCapacity, c.CarType, 
                   c.YearOfManufacture, c.FuelType, c.Mileage, c.Availability, c.CostPerHour, c.LocationOfCar
            FROM Reservations r
            INNER JOIN Cars c ON r.CarID = c.CarID
            WHERE r.UserID = @UserID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var reservation = new Reservation2()
                            {
                                ReservationID = (int)reader["ReservationID"],
                                CarID = (int)reader["CarID"],
                                ReservationStart = (DateTime)reader["ReservationStart"],
                                ReservationEnd = (DateTime)reader["ReservationEnd"],
                                TotalCarCost = (decimal)reader["TotalCarCost"],
                                Status = (string)reader["Status"],
                                UserID = userId // Assuming UserID is not part of the Reservation table, so we set it explicitly
                            };

                            var car = new Cars()
                            {
                                CarID = (int)reader["CarID"],
                                Manufacturer = (string)reader["Manufacturer"],
                                Model = (string)reader["Model"],
                                TransmissionType = (string)reader["TransmissionType"],
                                NoOfSeats = (int)reader["NoOfSeats"],
                                EngineCapacity = (int)reader["EngineCapacity"],
                                CarType = (string)reader["CarType"],
                                YearOfManufacture = (int)reader["YearOfManufacture"],
                                FuelType = (string)reader["FuelType"],
                                Mileage = (int)reader["Mileage"],
                                Availability = (bool)reader["Availability"],
                                CostPerHour = (decimal)reader["CostPerHour"],
                                LocationOfCar = (string)reader["LocationOfCar"]
                            };

                            // Assuming you want to include the car details in the reservation object
                            reservation.CarDetails = car; // You might need to add a CarDetails property to your Reservation model

                            reservations.Add(reservation);
                        }
                    }
                }
            }

            return reservations;
        }
        //


        //
        public void DeleteReservationAndUpdateCar(int reservationId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                // Step 1: Check if any bill exists for the reservation
                string checkBillQuery = "SELECT COUNT(*) FROM Bills WHERE ReservationID = @ReservationID";
                using (SqlCommand checkBillCommand = new SqlCommand(checkBillQuery, connection))
                {
                    checkBillCommand.Parameters.AddWithValue("@ReservationID", reservationId);
                    int billCount = (int)checkBillCommand.ExecuteScalar();

                    if (billCount > 0)
                    {
                        // Delete the bill record first
                        string deleteBillQuery = "DELETE FROM Bills WHERE ReservationID = @ReservationID";
                        using (SqlCommand deleteBillCommand = new SqlCommand(deleteBillQuery, connection))
                        {
                            deleteBillCommand.Parameters.AddWithValue("@ReservationID", reservationId);
                            deleteBillCommand.ExecuteNonQuery();
                        }
                    }
                }

                // Step 2: Delete the reservation
                string deleteReservationQuery = "DELETE FROM Reservations WHERE ReservationID = @ReservationID";
                using (SqlCommand deleteReservationCommand = new SqlCommand(deleteReservationQuery, connection))
                {
                    deleteReservationCommand.Parameters.AddWithValue("@ReservationID", reservationId);
                    deleteReservationCommand.ExecuteNonQuery();
                }

                // Step 3: Update the car's availability status
                string updateCarQuery = "UPDATE Cars SET Availability = 1 WHERE CarID IN (SELECT CarID FROM Reservations WHERE ReservationID = @ReservationID)";
                using (SqlCommand updateCarCommand = new SqlCommand(updateCarQuery, connection))
                {
                    updateCarCommand.Parameters.AddWithValue("@ReservationID", reservationId);
                    updateCarCommand.ExecuteNonQuery();
                }
            }
        }
        //

        //
        public Cars InsertCar(Cars car)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string insertCarQuery = "INSERT INTO Cars (CarID,Manufacturer, Model, TransmissionType, NoOfSeats, EngineCapacity, CarType, YearOfManufacture, FuelType, Mileage, Availability, CostPerHour, LocationOfCar) " +
                                        "VALUES (@CarID,@Manufacturer, @Model, @TransmissionType, @NoOfSeats, @EngineCapacity, @CarType, @YearOfManufacture, @FuelType, @Mileage, @Availability, @CostPerHour, @LocationOfCar)";

                using (SqlCommand insertCommand = new SqlCommand(insertCarQuery, connection))
                {
                    insertCommand.Parameters.AddWithValue("@CarID", car.CarID);
                    insertCommand.Parameters.AddWithValue("@Manufacturer", car.Manufacturer);
                    insertCommand.Parameters.AddWithValue("@Model", car.Model);
                    insertCommand.Parameters.AddWithValue("@TransmissionType", car.TransmissionType);
                    insertCommand.Parameters.AddWithValue("@NoOfSeats", car.NoOfSeats);
                    insertCommand.Parameters.AddWithValue("@EngineCapacity", car.EngineCapacity);
                    insertCommand.Parameters.AddWithValue("@CarType", car.CarType);
                    insertCommand.Parameters.AddWithValue("@YearOfManufacture", car.YearOfManufacture);
                    insertCommand.Parameters.AddWithValue("@FuelType", car.FuelType);
                    insertCommand.Parameters.AddWithValue("@Mileage", car.Mileage);
                    insertCommand.Parameters.AddWithValue("@Availability", car.Availability);
                    insertCommand.Parameters.AddWithValue("@CostPerHour", car.CostPerHour);
                    insertCommand.Parameters.AddWithValue("@LocationOfCar", car.LocationOfCar);

                    connection.Open();
                    insertCommand.ExecuteNonQuery();
                }
            }


            return car;
        }
        //

        public Models.Reservation CreateBill(Bill bill)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {

                using (SqlCommand deleteCommand = new SqlCommand("DELETE FROM Reservations WHERE ReservationID = @ReservationID", connection))
                {
                    deleteCommand.Parameters.AddWithValue("@ReservationID", bill.ReservationID);
                    connection.Open();

                    deleteCommand.ExecuteNonQuery();
                    connection.Close();
                }
                // Create and execute the stored procedure
                using (SqlCommand command = new SqlCommand("CreateBill", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@ReservationID", bill.ReservationID);
                    command.Parameters.AddWithValue("@UserID", bill.UserID);
                    command.Parameters.AddWithValue("@CarID", bill.CarID);
                    command.Parameters.AddWithValue("@ReservationStart", bill.ReservationStart);
                    command.Parameters.AddWithValue("@ReservationEnd", bill.ReservationEnd);
                    command.Parameters.AddWithValue("@TotalCarCost", bill.TotalCarCost);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
                
            }
           

            // Return the reservation data (if needed)
            return new Models.Reservation();
        }




        public IEnumerable<Bill2> GetBillsByUserIdWithCarDetails(int userId)
        {
            var bills = new List<Bill2>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                SELECT b.*, c.*
                FROM Bills b
                INNER JOIN Cars c ON b.CarID = c.CarID
                WHERE b.UserID = @UserID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var bill = new Bill2()
                            {
                                ReservationID = (int)reader["ReservationID"],
                                UserID = (int)reader["UserID"],
                                CarID = (int)reader["CarID"],
                                ReservationStart = (DateTime)reader["ReservationStart"],
                                ReservationEnd = (DateTime)reader["ReservationEnd"],
                                TotalCarCost = (decimal)reader["TotalCarCost"],
                            };

                            var car = new Cars()
                            {
                                CarID = (int)reader["CarID"],
                                Manufacturer = (string)reader["Manufacturer"],
                                Model = (string)reader["Model"],
                                TransmissionType = (string)reader["TransmissionType"],
                                NoOfSeats = (int)reader["NoOfSeats"],
                                EngineCapacity = (int)reader["EngineCapacity"],
                                CarType = (string)reader["CarType"],
                                YearOfManufacture = (int)reader["YearOfManufacture"],
                                FuelType = (string)reader["FuelType"],
                                Mileage = (int)reader["Mileage"],
                                Availability = (bool)reader["Availability"],
                                CostPerHour = (decimal)reader["CostPerHour"],
                                LocationOfCar = (string)reader["LocationOfCar"]
                            };

                            bill.CarDetails = car;
                            bills.Add(bill);
                        }
                    }
                }
            }

            return bills;
        }

        //
        public IEnumerable<Bill2> GetBillsWithCarDetails()
        {
            // Implement the SQL query to fetch bills with car details
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
        SELECT b.*, c.*
        FROM Bills b
        INNER JOIN Cars c ON b.CarID = c.CarID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        List<Bill2> bills = new List<Bill2>();

                        while (reader.Read())
                        {
                            var bill = new Bill2()
                            {
                                ReservationID = (int)reader["ReservationID"],
                                UserID = (int)reader["UserID"],
                                CarID = (int)reader["CarID"],
                                ReservationStart = (DateTime)reader["ReservationStart"],
                                ReservationEnd = (DateTime)reader["ReservationEnd"],
                                TotalCarCost = (decimal)reader["TotalCarCost"],
                            };

                            var car = new Cars()
                            {
                                CarID = (int)reader["CarID"],
                                Manufacturer = (string)reader["Manufacturer"],
                                Model = (string)reader["Model"],
                                TransmissionType = (string)reader["TransmissionType"],
                                NoOfSeats = (int)reader["NoOfSeats"],
                                EngineCapacity = (int)reader["EngineCapacity"],
                                CarType = (string)reader["CarType"],
                                YearOfManufacture = (int)reader["YearOfManufacture"],
                                FuelType = (string)reader["FuelType"],
                                Mileage = (int)reader["Mileage"],
                                Availability = (bool)reader["Availability"],
                                CostPerHour = (decimal)reader["CostPerHour"],
                                LocationOfCar = (string)reader["LocationOfCar"]
                            };

                            bill.CarDetails = car;
                            bills.Add(bill);
                        }

                        return bills;
                    }
                }

               
            }
        }


        public  Review InsertReview(Review review)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string insertReviewQuery = "INSERT INTO Reviews (Rating, Review, UserID, CarID) " +
                                            "VALUES (@Rating, @Review, @UserID, @CarID)";

                using (SqlCommand insertCommand = new SqlCommand(insertReviewQuery, connection))
                {
                    insertCommand.Parameters.AddWithValue("@Rating", review.Rating);
                    insertCommand.Parameters.AddWithValue("@Review", review.ReviewText);
                    insertCommand.Parameters.AddWithValue("@UserID", review.UserID);
                    insertCommand.Parameters.AddWithValue("@CarID", review.CarID);

                    connection.Open();
                    insertCommand.ExecuteNonQuery();
                }
            }
            return review;
        }

        public IEnumerable<Review> GetReviewsByCarID(int carID)
        {
            var reviews = new List<Review>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Reviews WHERE CarID = @CarID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CarID", carID);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var review = new Review()
                            {
                                RatingID = (int)reader["RatingID"],
                                Rating = (int)reader["Rating"],
                                ReviewText = (string)reader["Review"],
                                UserID = (int)reader["UserID"],
                                CarID = carID
                            };

                            reviews.Add(review);
                        }
                    }
                }
            }

            return reviews;
        }

        public Image GetImageByCarID(int carID)
        {
            Image image = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT ImageID, Image FROM Image WHERE CarID = @CarID";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CarID", carID);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            image = new Image()
                            {
                                ImageID = (int)reader["ImageID"],
                                ImageUrl = (string)reader["Image"],
                                CarID = carID
                            };
                        }
                    }
                }
            }

            return image;
        }
        public void InsertImage(Image image)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string insertImageQuery = "INSERT INTO Image (Image, CarID) " +
                                            "VALUES (@Image, @CarID)";

                using (SqlCommand insertCommand = new SqlCommand(insertImageQuery, connection))
                {
                    insertCommand.Parameters.AddWithValue("@Image", image.ImageUrl);
                    insertCommand.Parameters.AddWithValue("@CarID", image.CarID);

                    connection.Open();
                    insertCommand.ExecuteNonQuery();
                }
            }
        }
    }
}