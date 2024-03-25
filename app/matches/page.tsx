import { getMatchFixtures, getMatchResults } from "@/actions/match.actions";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchDetail } from "./_components/match-detail/match-detail";

const MatchListPage = async () => {
  const fixtures = await getMatchFixtures();
  const results = await getMatchResults();
  const MATCHLIST_TYPES = [
    { value: "fixtures", label: "Fixtures", data: fixtures },
    { value: "results", label: "Results", data: results },
  ];

  return (
    <>
      <PageHeader
        title="Matches"
        desc="Browse through IPL schedule and predict winners to win big!!"
      />

      <div className="pt-16 px-4 min-h-screen">
        <Tabs
          defaultValue={MATCHLIST_TYPES[0].value}
          className="w-full max-w-7xl mx-auto"
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
              <div className="w-full max-w-7xl mx-auto grid gap-4">
                <Card className="w-full">
                  <CardContent className="space-y-8 px-0 md:px-4">
                    {type.data.length === 0 && (
                      <div className="w-full pt-2 flex items-center justify-center text-lg font-semibold">
                        No Matches to display
                      </div>
                    )}
                    {type.data.map((match, i) => (
                      <MatchDetail key={match.id} match={match} index={i} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default MatchListPage;
