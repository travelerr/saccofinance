import Image from 'next/image';
export default function ThemedHeadshot({alt,width=1200,height=900,sizes,priority=false}:{alt:string;width?:number;height?:number;sizes:string;priority?:boolean}){
 return <><Image className="headshot-dark" src="/images/headshot.jpg" alt={alt} width={width} height={height} sizes={sizes} priority={priority}/><Image className="headshot-light" src="/images/headshot-light.png" alt={alt} width={width} height={height} sizes={sizes} priority={priority}/></>;
}
