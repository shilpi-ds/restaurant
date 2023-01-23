const Header = () =>{
return(
<div className="centered-container">
      <nav className="flex items-center justify-between">
        <div className="pl-40">
          <img
            src="https://communityfibre.co.uk/_next/static/images/logoDesktop-9bf97008bd5975f83100ccfb417dfa14.svg"
            width="full"
            height="50"></img> </div>
        <ul className="submenu flex  justify-center gap-x-10 text-2xl font-normal">
        <li><a href="/accessories.html">Accessories</a></li>
            <li><a href="https://communityfibre.co.uk/">Broadband</a></li>
            <li><a href="https://communityfibre.co.uk/tv">TV</a></li>
            <li><a href="https://communityfibre.co.uk/landline">Calls</a></li>
            <li><a href="https://communityfibre.co.uk/deals">Deals</a></li>
            <li><a href="https://communityfibre.co.uk/why-choose-community-fibre">Why choose us</a></li>
        </ul>
       
        <div className="mr-80">
          <a href="https://communityfibre.co.uk/#postcode-search-modal" >Get Started</a>
        </div>
      </nav>
    </div>
    );
}

export default Header;