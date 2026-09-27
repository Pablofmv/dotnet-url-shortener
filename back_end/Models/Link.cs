using System.ComponentModel.DataAnnotations.Schema;

namespace UrlShortener.Models;

[Table("links")]
public class Link 
{   
    [Column("id")]
    public Guid Id {get; set;}

    [Column("subdomain")]
    public string Subdomain {get; set;} = "";

    [Column("destination_url")]
    public string DestinationUrl {get; set;} = "";
}