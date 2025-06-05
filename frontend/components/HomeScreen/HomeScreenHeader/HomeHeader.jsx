import React from 'react';

const ecoCategories = [
  {
    title: 'Eco-Friendly Bamboo Toothbrush',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrFkcLsuoxufM2XXyJyLvHgUa3hYlTsiJDpw&s',
  },
  {
    title: 'Reusable Shopping Bags',
    img: 'https://lamansh.in/cdn/shop/files/45-rs-each-on-buying-in-bulk-call-at-8619550223-jute-gift-bags-lamansh-plain-10-7-3-5-inch-jute-bags-for-packing-wedding-favors-giveaways-and-return-gifts-31372215844925_720x.heic?v=1703689324',
  },
  {
    title: 'Solar Panels',
    img: 'https://cdn.igs.com/green-public-assets/images/default-source/public-assets/6.-energy-101/solar-panels859dac3875e04b8b86cb425265d5fbf9.jpg?sfvrsn=c7370192_4',
  },
  {
    title: 'Organic Cotton Clothing',
    img: 'https://brownliving.in/cdn/shop/files/human-nature-womens-organic-cotton-t-shirt-sage-ek-saath-sustainable-womens-t-shirt-brown-living-hn-wt-sage-s-105482.jpg?v=1720422238&width=1200',
  },
  {
    title: 'Recycled Paper Products',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsscPSTiSUMVwjYTtCue2rXhmiyjOKiZl1kg&s',
  },
  {
    title: 'Compostable Food Containers',
    img: 'https://i0.wp.com/www.sciencenews.org/wp-content/uploads/2019/06/060319_CW_compost_feat.jpg',
  },
  {
    title: 'Water-saving Shower Heads',
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'LED Light Bulbs',
    img: 'https://www.compliancegate.com/wp-content/uploads/2020/02/led-lighting-safety-standards-eu.jpg',
  },
  {
    title: 'Electric Bikes',
    img: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Reusable Water Bottles',
    img: 'https://cdn.shopify.com/s/files/1/0669/1684/3771/files/Dangers-Of-Not-Cleaning-Your-Reusable-Water-Bottlejpg.jpg',
  },
  {
    title: 'Biodegradable Straws',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4igPhOoENm97cSSC0JAUJFKCQuXcxLidEsQ&s',
  },
  {
    title: 'Solar-Powered Chargers',
    img: 'https://media.wired.com/photos/66f6d9e8edd5b22be7017791/3:2/w_2560%2Cc_limit/GettyImages-1681913304.jpg',
  },
  {
    title: 'Eco-Friendly Cleaning Products',
    img: 'https://res.cloudinary.com/drt2tlz1j/images/f_auto,q_auto/v1690263898/fn1/eco-friendly-cleaning-products/eco-friendly-cleaning-products.png?_i=AA',
  },
  {
    title: 'Recycled Metal Products',
    img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Sustainable Furniture',
    img: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=60',
  },
];

const HomeHeader = () => {
  return (
    <div className="bg-yellow-200 py-3 px-6 ">
      <h2 className="text-center text-2xl font-semibold mb-3 text-gray-900">
        Eco Product Categories
      </h2>
      <div className="flex gap-10 overflow-x-auto pb-2 hide-scrollbar">
        {ecoCategories.map(({ title, img }) => (
          <div key={title} className="flex-shrink-0 w-24 flex flex-col items-center">
            <img
              src={img}
              alt={title}
              className="w-24 h-24 object-cover rounded-full shadow-md"
            />
            <p className="mt-2 text-center text-gray-900 font-semibold text-xs">
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHeader;
