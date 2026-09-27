type AnalyticsCardProps = {
    title : string;
    value : number;
};

function AnalyticsCard({
    title,
    value,
} : AnalyticsCardProps)
{
    return (
        <div>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}

export default AnalyticsCard;