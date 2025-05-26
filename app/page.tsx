"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useGlobalContext } from "@/context/globalContext";
import {
  Briefcase,
  Building,
  CheckCircleIcon,
  SearchIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/findwork?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/findwork");
    }
  };

  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-[#7263f3]" />,
      title: "Төрөл бүрийн боломжууд",
      description:
        "Төрөл бүрийн салбарт, хүссэн цагтаа хүссэн ажилаа бидэнтэй холбогдон олоорой.",
      benefits: [
        "Цагийн уян хатан байдал",
        "Хурдан ажил олох боломж",
        "Туршлага хуримтлуулах",
      ],
      cta: "Ажлын байр судлах",
      ctaLink: "/findwork",
    },
    {
      icon: <Building className="w-6 h-6 text-[#7263f3]" />,
      title: "Employer Branding",
      description:
        "Ажил олгогчийн брэндинг хүчирхэг байх тусам чадварлаг ажилчдыг татах, тогтоон барих боломжийг нэмэгдүүлдэг байна.",
      benefits: [
        "Хүний нөөцийн бодлогын сайн туршлагыг олон нийтэд түгээх",
        "Хүний нөөцийн мэргэжилтнүүдэд зориулсан мэдээллийн товхимол",
        "Хүний хөгжил болон карьерын дэвшилд хэрэг болохуйц",
      ],
      cta: "Холбогдох",
      ctaLink: "/findwork",
    },
    {
      icon: <Users className="w-6 h-6 text-[#7263f3]" />,
      title: "Хүний хөгжил бол бидний үнэ цэнэ",
      description:
        "Байгууллагын гол үнэт зүйл бол хүн бүрийн өсөлт, хөгжлийг дэмжих явдал юм.",
      benefits: [
        "Хурдан хүний нөөц бүрдүүлэх",
        "Ажлын ачаалал их үед дэмжлэг авах",
        "Дадлагын ажилтан авах боломж",
      ],
      cta: "Зар оруулах",
      ctaLink: "/post",
    },
  ];

  return (
    <main>
      <Header />

      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#7263f3] md:text-5xl font-bold mb-6">
            Иргэн бүрд ажлын байр
          </h1>
          <p className="text-xl mb-8">
            Байгууллагын гол үнэт зүйл бол хүн бүрийн өсөлт, хөгжлийг дэмжих
            явдал юм
          </p>
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex gap-4"
          >
            <Input
              type="text"
              placeholder="Ажил хайх"
              className="flex-grow bg-white text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" className="bg-[#7263f3] text-white">
              <SearchIcon className="w-6 h-6" />
              Хайх
            </Button>
          </form>
        </div>
      </section>

      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Бидний <span className="text-[#7263f3] font-extrabold">Тухай</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col h-full rounded-xl border-none"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />

                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={feature.ctaLink}>{feature.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Badge
              variant={"outline"}
              className="text-sm font-medium border-gray-400"
            >
              Иргэн ба байгууллагатай хамтран ажиллана.
            </Badge>
          </div>
        </div>
      </section>

      <section className="py-[7rem] bg-[#d7dedc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Та юу сонирхож байна вэ?</h2>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button size={"lg"} asChild>
              <Link href={"/findwork"}>Ажил хайх</Link>
            </Button>
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/post"}>Ажилтан хайх</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
