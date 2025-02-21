import { Input } from "./src/components/ui/input";
import { Button } from "./src/components/ui/button";
import { Card } from "./src/components/ui/card";
import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import "./locatesub.css"

const SpecialistFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const specialties = [
    "Cardiologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Dermatologist",
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* Main Search Block */}
      <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-center">Find A Specialist</h1>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search by specialist name or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specialty Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Specialties</h2>
          <div className="space-y-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Specialists List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Available Specialists</h2>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <SpecialistCard key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Nearby Hospitals</h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Map will be displayed here</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SpecialistCard() {
  return (
    <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">Dr</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Dr. Sarah Johnson</h3>
          <p className="text-sm text-muted-foreground">Cardiologist</p>
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm ml-1">4.8</span>
            <span className="text-sm text-muted-foreground ml-2">(124 reviews)</span>
          </div>
        </div>
        <Button variant="outline" className="self-center">
          Book Now
        </Button>
      </div>
    </Card>
  );
};
export default SpecialistFinder;
