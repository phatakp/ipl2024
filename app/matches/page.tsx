import { getMatchFixtures, getMatchResults } from "@/actions/match.actions";
import { LoadMore } from "@/components/load-more";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MatchListPage = async () => {
  const fixtures = await getMatchFixtures(1);
  const results = await getMatchResults(1);
  const MATCHLIST_TYPES = [
    { value: "fixtures", label: "Fixtures", data: fixtures },
    { value: "results", label: "Results", data: results },
  ];

  return (
    <div className="pt-16 px-4 min-h-screen">
      <Tabs
        defaultValue={MATCHLIST_TYPES[0].value}
        className="w-full max-w-6xl mx-auto"
      >
        <TabsList>
          {MATCHLIST_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {MATCHLIST_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <div className="w-full max-w-6xl mx-auto grid gap-4">
              <Card className="w-full px-0 md:px-4 shadow-md">
                <CardContent className="">
                  {type.data.length === 0 ? "No Records to show" : type.data}
                </CardContent>
              </Card>
            </div>
            <LoadMore type={type.value as any} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MatchListPage;
