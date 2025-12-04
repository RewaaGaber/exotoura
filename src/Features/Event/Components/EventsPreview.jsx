import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Link, useNavigate } from "react-router-dom";

const tempData = [
  {
    title: "Pyramids Light Show",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    date: "Apr 20, 2025",
    price: "45",
    rating: "4.8",
  },
  {
    title: "Nile Dinner Cruise",
    image: "https://images.unsplash.com/photo-1552334823-ca7f70376914",
    date: "Apr 21, 2025",
    price: "75",
    rating: "4.9",
  },
  {
    title: "Desert Safari",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969",
    date: "Apr 22, 2025",
    price: "120",
    rating: "4.7",
  },
  {
    title: "Egyptian Museum Tour",
    image: "https://images.unsplash.com/photo-1562979314-bee7453e911c",
    date: "Apr 23, 2025",
    price: "35",
    rating: "4.9",
  },
];

const EventsPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="events" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link
            to="/events"
            className="group flex items-center gap-2 text-orange-500 hover:text-orange-600"
          >
            Show more
            <i className="pi pi-arrow-right w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tempData.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
              onClick={() => navigate("/events/id")}
            >
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 text-sm font-semibold flex items-center gap-1">
                  <i className="pi pi-star w-4 h-4 text-yellow-400" />
                  {event.rating}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="pi pi-calendar w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">£</span>
                    {event.price}
                  </div>
                </div>

                <button
                  className={classNames(
                    "overflow-hidden hover:bg-amber-500 hover:border-amber-500 text-amber-500 hover:text-white",
                    "transition-all w-full group bg-white relative",
                    "border border-neutral-200 py-2 mt-4 rounded-md"
                  )}
                >
                  <span className="relative z-10 text-sm font-medium">View Details</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-300 ease-out left-0 h-full bg-current opacity-20" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
