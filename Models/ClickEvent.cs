using System.ComponentModel.DataAnnotations.Schema;

namespace UrlShortener.Models;


[Table("click_events")]
public class ClickEvent 
{
    [Column("id")]
    public Guid Id {get; set;}

    [Column("link_id")]
    public Guid LinkId {get; set;}

    [Column("subdomain")]
    public string Subdomain {get; set;} = "";

    [Column("clicked_at")]
    public DateTime ClickedAt {get; set;}

    [Column("ip_address")]
    public string IpAddress {get; set;} = "";

    [Column("referrer")]
    public string Referrer {get; set;} = "";

    [Column("user_agent")]
    public string UserAgent {get; set;} = "";

    [Column("country")]
    public string Country {get; set;} = "";

    [Column("region")]
    public string Region {get; set;} = "";

    [Column("organization")]
    public string Organization {get; set;} = "";

    [Column("is_bot")]
    public bool IsBot {get; set;} 
}