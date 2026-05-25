import React, { useState } from 'react';
import { addToCart, getCart, removeFromCart, getCartTotal } from '../utils/cart';
import { BsChevronUp } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Cartpage() {
    const [cart, setCart] = useState(getCart());

    return (
        <div className="w-full flex flex-col items-center p-20">
            {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
            ) : (
                cart.map((item, index) => {
                    return (
                        <div key={`${item.productID || item.name}-${index}`} className='w-[500px] h-[150px] rounded-xl overflow-hidden shadow-2xl my-1 flex justify-between'>
                            <img src={item.image} className='h-full aspect-square object-cover'  />
                            <div className='flex flex-col justify-center pl-4'>
                                <h1 className='text-2xl font-semibold relative group'>
                                    <span className='opacity-0 group-hover:opacity-100 transition-opacity italic text-sm absolute bottom-[20px] left-0 bg-accent text-white px-2 rounded-full whitespace-nowrap'>
                                        {item.name}
                                    </span>
                                    {
                                    item.name.length>20 ? item.name.slice(0, 20) + "..." : item.name
                                   }
                                </h1>
                                {
                                    item.labeledPrice > item.price && (
                                        <h2 className='text-secondary/80 line-through decoration-gold/70 decoration-2 mr-2 text-lg'>
                                            LKR {item.labeledPrice.toFixed(2)}
                                        </h2>
                                    )
                                }
                                <h2 className='text-xl font-semibold text-accent mt-2'>LKR. {item.price.toFixed(2)}</h2>
                                <h3 className='text-lg mt-2'> {item.productID}</h3>
                            </div>
                            <div className='h-full flex flex-row items-center gap-4'>
                                <div className='h-full flex flex-col justify-center items-center'>
                                    <BsChevronUp 
                                    onClick={()=>{
                                        addToCart(item,1)
                                        const newCart=getCart();
                                        setCart(newCart)
                                    }}
                                    className='text-2xl cursor-pointer hover:text-accent transition-colors'/>
                                    <span className='text-lg font-semibold'>{item.quantity}</span>
                                    <BsChevronUp 
                                    onClick={()=>{
                                        addToCart(item,-1)
                                        const newCart=getCart();
                                        setCart(newCart)
                                    }}
                                    className=' rotate-180 text-2xl cursor-pointer hover:text-accent transition-colors'/>
                                </div>
                                <span className='pr-4 text-lg font-semibold'>Total: LKR. {(item.price * item.quantity).toFixed(2)}</span>
                                <MdDelete 
                                onClick={()=>{
                                    removeFromCart(item.productID)
                                    const newCart=getCart();
                                    setCart(newCart)
                                }}
                                className='text-2xl cursor-pointer text-red-500 hover:text-red-700 transition-colors mr-2'/>

                            </div>
                        </div>
                    );
                })
            )}
            {cart.length > 0 && (
               <div className='w-[500px] mt-6 flex flex-col items-end gap-2'>
    {/* Total goes on top (or first) */}
    <span className='text-xl font-semibold'>
        Total: LKR. {getCartTotal().toFixed(2)}
    </span>

    {/* Checkout Button goes below */}
    <Link
        to="/checkout"
        className='px-8 py-2 rounded bg-accent text-white hover:bg-accent/90 transition duration-300'
    
        state={
            cart
        }
        >
        Checkout
    </Link>
</div>
            )}
        </div>
    );
}