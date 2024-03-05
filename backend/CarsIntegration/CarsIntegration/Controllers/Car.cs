namespace CarsIntegration.Controllers
{
    internal class Car
    {
        public int CarID { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        public string TransmissionType { get; set; }
        public int NoOfSeats { get; set; }
        public int EngineCapacity { get; set; }
        public string CarType { get; set; }
        public int YearOfManufacture { get; set; }
        public string FuelType { get; set; }
        public int Mileage { get; set; }
        public bool Availability { get; set; }
        public decimal CostPerHour { get; set; }
        public string LocationOfCar { get; set; }

        public decimal TotalCost { get; set; }
    }

    public class Reservation
    {
        public int ReservationID { get; set; }
        public int CarID { get; set; }
        public DateTime ReservationStart { get; set; }
        public DateTime ReservationEnd { get; set; }
        public decimal TotalCarCost { get; set; }
        public string Status { get; set; }
        public double CostPerHour { get; internal set; }
    }
}