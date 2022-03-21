using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;


namespace MVC_with_React.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Please enter a Product Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter a Product Price")]
        public int Price { get; set; }


    }
}
