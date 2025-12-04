import { Link } from "react-router-dom";

import Header from "./Header"
const StartPage = () => {
  return (
    <div className="bg-white font-['Airbnb_Cereal_VF', 'Circular', '-apple-system', 'system-ui', 'Roboto', 'Helvetica Neue', 'sans-serif'] text-sm text-gray-800 antialiased">
      {/* Main Content */}
      <main className="flex flex-row  w-full opacity-100 transition-opacity duration-600">
        // headers
        <Header Save={false}/>
        {/* Content Section */}
        <div className="flex flex-row w-full mt-[10%]  px-32 overflow-y-auto">
          <div className="flex flex-col justify-center items-start w-[50vw] max-w-[700px]">
            <h1 className="text-5xl font-medium mb-4 max-w-[450px]">It’s easy to get started on Exotoura</h1>
          </div>
          <div>
            {/* Step 1 */}
            <div className="flex flex-row py-8 border-b border-gray-200">
              <div className="pr-4 text-2xl font-medium">1</div>
              <div className="mr-4 max-w-[448px]">
                <h2 className="text-xl font-medium mb-2">Tell us about your place</h2>
                <h3 className="text-sm text-gray-600">Share some basic info, like where it is and how many guests can stay.</h3>
              </div>
              <div className="ml-auto">
                <img
                  src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
                  alt="Step 1"
                  className="w-[116px] h-24 object-cover"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-row py-8 border-b border-gray-200">
              <div className="pr-4 text-2xl font-medium">2</div>
              <div className="mr-4 max-w-[448px]">
                <h2 className="text-xl font-medium mb-2">Make it stand out</h2>
                <h3 className="text-sm text-gray-600">Add 5 photos plus a title and description—we’ll help you out.</h3>
              </div>
              <div className="ml-auto">
                <img
                  src="https://a0.muscache.com/4ea/air/v2/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg"
                  alt="Step 2"
                  className="w-[116px] h-24 object-cover"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-row py-8">
              <div className="pr-4 text-2xl font-medium">3</div>
              <div className="mr-4 max-w-[448px]">
                <h2 className="text-xl font-medium mb-2">Finish up and publish</h2>
                <h3 className="text-sm text-gray-600">Choose a starting price, verify a few details, then publish your accommodation.</h3>
              </div>
              <div className="ml-auto">
                <img
                  src="https://a0.muscache.com/4ea/air/v2/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg"
                  alt="Step 3"
                  className="w-[116px] h-24 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 z-20">
          <div className="flex justify-end items-center p-4">
            <Link
              to="/accommodation/new"
              style={{
                background: "linear-gradient(to right, #ef4444, #db2777)",
              }}
              className="text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-shadow"
            >
              Get started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartPage;
