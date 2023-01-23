import { ReactComponent as MagnifyingGlassIcon } from '../../icons/magnifying_glass.svg';

export function renderSearchAreaButton(handleOnClick: () => void) {
  return (
    <button
      className="absolute right-1/2 top-5 translate-x-1/2 transform rounded-md bg-white "
      aria-label="Search this area"
      onClick={handleOnClick}>
      <div className="flex py-1 px-2 font-heading text-black">
        <div className="h-7 w-7">
          <MagnifyingGlassIcon />
        </div>
        <span className="">Search this area</span>
      </div>
    </button>
  );
}
