import React from "react";
import Image from "next/image";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";

function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className=" mb-9">
              <h1 className="text-4xl font-semibold text-black dark:text-white">
              Start creating your budget and save ton of money <br />
                <span className="text-4xl md:text-[6rem] text-blue-800 font-bold mt-1 leading-none">
                  Manage Your Expenses
                </span>
              </h1>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  href="/sign-in"
                >
                  Get Started
                </a>
              </div>
            </div>
          }
        >
          <Image
            src={`/image.png`}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  );
}

export default Hero;
