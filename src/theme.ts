import { Nunito_Sans } from "next/font/google"

const theme = {
    primaryColor: "#67b455",
    misc: {
        rootFontSizes: "text-[5.5px] min-[250px]:text-[7px] min-[300px]:text-[8.5px] min-[500px]:text-[10px] min-[600px]:text-[10px] min-[640px]:text-[9px] min-[768px]:text-[6.5px] min-[900px]:text-[7px] min-[970px]:text-[7.5px] min-[1024px]:text-[8px] min-[1400px]:text-[8.7px] [--scrollbarTrackColor:rgb(240,240,240)] [--scrollbarThumbColor:rgba(0,0,0,0.1)] [--scrollbarThumbHoverColor:rgba(0,0,0,0.3)] [--body-padding:1.5rem] min-[380px]:[--body-padding:2rem] min-[600px]:[--body-padding:3rem] min-[680px]:max-sm:[--body-padding:4rem] lg:[--body-padding:4rem]",
        bodyClasses: "min-h-dvh max-h-dvh overflow-hidden bg-body_bg text-para text-[1.7rem] font-medium w-full",
    },
    inputCommonStyling: "input-field appearance-none text-[clamp(16px,1rem,1.6rem)] sm:text-[1.6rem] text-title outline-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none w-full focus-within:shadow-[0_0_0_2px_var(--color-primary)] [&.invalid]:!border-error p-[0.8em_1em] rounded-[0.5em] bg-[#F7F8F9] border-[1px] border-[#E8ECF4] placeholder:text-[#9CA5AD]",
}

export const primaryFont = Nunito_Sans({
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "Times New Roman"],
})

export default theme