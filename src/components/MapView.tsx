import { Map, Marker } from "pigeon-maps";

interface MapViewProps {
  className?: string;
}

export const MapView = ({ className }: MapViewProps) => {
  // Harvard Square coordinates
  const center: [number, number] = [42.3736, -71.1167];

  // Mock places
  const places = [
    { name: "Café Nero", coords: [42.3745, -71.1185] as [number, number] },
    { name: "The Sinclair", coords: [42.3730, -71.1195] as [number, number] },
    { name: "Tatte Bakery", coords: [42.3720, -71.1210] as [number, number] },
    { name: "Widener Library", coords: [42.3744, -71.1165] as [number, number] },
  ];

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <Map 
        center={center} 
        zoom={14}
        defaultWidth={800}
        defaultHeight={600}
      >
        {places.map((place, index) => (
          <Marker 
            key={index}
            anchor={place.coords}
            color="hsl(263 70% 50%)"
          />
        ))}
      </Map>
    </div>
  );
};
