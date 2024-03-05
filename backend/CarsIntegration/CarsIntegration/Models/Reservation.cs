namespace CarsIntegration.Models
{
    public class Reservation
    {
        public int ReservationID { get; set; }
        public int CarID { get; set; }
        public DateTime ReservationStart { get; set; }
        public DateTime ReservationEnd { get; set; }
        public decimal TotalCarCost { get; set; }
        public string Status { get; set; }
        public double CostPerHour { get; internal set; }

        public int UserID { get; set; }

        

    }
}
