import { getMatchFixtures, getMatchResults } from "@/actions/match";
import { MatchDetail } from "@/app/matches/_components/match-detail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MatchListPage = async () => {
  const fixtures = await getMatchFixtures();
  const results = await getMatchResults();

  return (
    <div className="pt-16 px-4 min-h-screen">
      <Tabs defaultValue="fixtures" className="w-full max-w-6xl mx-auto">
        <TabsList>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        <TabsContent value="fixtures">
          <div className="flex flex-col justify-center items-center gap-6 max-w-6xl mx-auto">
            <Card className="w-full px-0 md:px-4 shadow-md">
              <CardContent>
                {fixtures?.map((match) => (
                  <MatchDetail key={match.id} match={match} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="results">
          <div className="flex flex-col justify-center items-center gap-6 max-w-6xl mx-auto">
            <Card className="w-full px-0 md:px-4 shadow-md">
              {!!results && results.length === 0 && (
                <CardHeader>No Matches to display yet</CardHeader>
              )}
              <CardContent>
                {results?.map((match) => (
                  <MatchDetail key={match.id} match={match} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchListPage;
