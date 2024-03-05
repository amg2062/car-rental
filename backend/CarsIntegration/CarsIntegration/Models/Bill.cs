namespace CarsIntegration.Models
{
    public class Bill
    {
        public int ReservationID { get; set; }
        public int UserID { get; set; }
        public int CarID { get; set; }
        public DateTime ReservationStart { get; set; }
        public DateTime ReservationEnd { get; set; }
        public decimal TotalCarCost { get; set; }
    }


}
