import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Search, Filter, LayoutGrid } from "lucide-react";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All", "vegetables", "fruits", "cakes", "biscuits",
        "Frozen Foods", "Beverages", "Dairy Products", "Spices & Condiments", "Snacks", "Breads & Buns", "Cleaning Supplies"
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/products/all");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search සහ Category දෙකම අනුව Filter කරන function එක
    const handleFilter = async (searchVal, catVal) => {
        let url = import.meta.env.VITE_BACKEND_URL + "/products/all";
        
        // සර්ච් එකක් තියෙනවා නම් සර්ච් URL එක භාවිතා කරයි
        if (searchVal !== "") {
            url = `${import.meta.env.VITE_BACKEND_URL}/products/search?q=${searchVal}`;
        }

        try {
            const res = await axios.get(url);
            let filteredData = res.data;

            // Category එක "All" නෙවෙයි නම් ලැබෙන දත්ත වලින් Filter කරයි
            if (catVal !== "All") {
                filteredData = filteredData.filter(p => p.category === catVal);
            }
            
            setProducts(filteredData);
        } catch (err) {
            console.error("Filtering error:", err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] pb-20 pt-0">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-100 px-6 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">EXPLORE PRODUCTS</h1>
                            <p className="text-slate-500 font-medium">Find the best hardware for your next build.</p>
                        </div>

                        {/* Search & Filter Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-1 sm:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search gear..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        handleFilter(e.target.value, selectedCategory);
                                    }}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    className="appearance-none pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-700 cursor-pointer"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        handleFilter(query, e.target.value);
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold animate-pulse tracking-widest text-xs uppercase">Updating Inventory...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-8 text-slate-400">
                            <LayoutGrid size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">{products.length} Products Found</span>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map((item) => (
                                    <ProductCard key={item.productID || item._id} product={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                                <Search size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold text-lg">No results found for "{query}"</p>
                                <button 
                                    onClick={() => {setQuery(""); setSelectedCategory("All"); fetchProducts();}}
                                    className="mt-4 text-blue-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}