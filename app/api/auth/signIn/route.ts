import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    try {
        await connectDB();
        const {name,password} = await request.json();

        if(!name || !password){
            return NextResponse.json({
                status:400,
                message:"all credentials required"
            })
        }

        const admin = await Admin.findOne(name);
        if(!admin){
            return 
        }
    } catch (error) {
        
    }
}