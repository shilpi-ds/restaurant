export function renderSelectedLocation(name?: string, addressLine1?: string, addressLine2?: string) {
  return (
    <div className="absolute bottom-2 left-0 right-0 mx-auto flex w-96  rounded-xl bg-white">
      <div className="flex space-x-2 p-2">
        <img
          className="h-20 rounded-lg bg-cover shadow-gym"
          src="https://a.mktgcdn.com/p/Yyz-pNtNAlYZKTSQpzQaPrHi_q7-xmZns9UMvK30Vh8/2370x1422.jpg"
          alt="gym"
        />
        <div className="">
          <span className="inline-flex font-heading text-sm text-black">{name}</span>
          <div className="flex flex-col">
            <span className="inline-flex font-body text-sm text-black">{addressLine1}</span>
            <span className="inline-flex font-body text-sm text-black">{addressLine2}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
