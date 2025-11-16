const getBoothColorClass = (selected) => {
  switch (selected) {
    case "energy":
      return "bg-[#A3C89F]"; // #479200 + 40% opacity on white
    case "ict":
      return "bg-[#FFE599]"; // #FFCC00 + 40% opacity on white
    case "advanced":
      return "bg-[#FFC4A4]"; // #FF9249 + 58% opacity on white
    case "mobility":
      return "bg-[#9BB5D3]"; // #386CAE + 40% opacity on white
    case "bioHealth":
      return "bg-[#C6AED0]"; // #8D5DC1 + 40% opacity on white
    default:
      return "bg-[#A3C89F]";
  }
};
export default getBoothColorClass;
