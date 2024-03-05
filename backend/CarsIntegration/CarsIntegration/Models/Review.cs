namespace CarsIntegration.Models
{
    public class Review
    {
        public int RatingID { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public int UserID { get; set; }
        public int CarID { get; set; }
    }
}
