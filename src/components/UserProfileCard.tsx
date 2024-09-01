import React from 'react';

const UserProfileCard = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-32 py-24 flex flex-col justify-center h-svh">
        {/* Alpine.js component for cookie banner */}
        <div
          x-data="{ showAlert: true }"
          x-init="$nextTick(() => { if (showAlert) $refs.firstButton.focus() })"
          x-show="showAlert"
          role="dialog"
          aria-labelledby="cookieBannerTitle"
          aria-describedby="cookieBannerDesc"
        >
          {/* Cookie banner content container */}
          <div className="mx-auto p-8 lg:p-10 bg-white rounded-3xl ring-1 ring-gray-200 ring-inset shadow-2xl max-w-lg text-center">
            <img
              src="https://i.pinimg.com/originals/ef/86/cf/ef86cfbac3952cbfdaacb66e8ca3b685.gif"
              alt="Cookies"
              className="w-32 h-32 mx-auto rounded-full -mt-24"
            />
            <h2 id="cookieBannerTitle" className="text-2xl font-medium mt-8">
              Our website uses cookies
            </h2>
            <p id="cookieBannerDesc" className="mt-4 text-gray-500">
              Our website uses cookies. By continuing, we assume your permission
              to deploy cookies as detailed in our
              <a
                href="#_"
                className="underline hover:text-orange-600 text-black"
              >
                Privacy Policy.
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileCard;
